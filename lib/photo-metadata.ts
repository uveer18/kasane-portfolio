
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type PhotoMetadataInput = {
  image: Buffer;
  mimeType: string;
  title?: string;
  collection?: string;
  description?: string;
  existingCollections: string[];
};

type GeneratedMetadata = {
  title?: string;
  collection?: string;
  collectionIsNew?: boolean;
  description?: string;
};

const SYSTEM_PROMPT = `
You are a professional nature and photography archivist.

Your task is to inspect a photograph and generate missing metadata.

STRICT RULES:

1. Only generate fields explicitly requested.
2. Never modify, rewrite, improve, or replace a field that the user has already provided.
3. Titles must be concise, natural, descriptive and editorial.
4. Avoid generic titles such as:
   - Nature study
   - Beautiful nature
   - Photography
   - Image 01
5. Descriptions should be informative, natural and visually grounded.
6. Describe the subject, composition, lighting, colours, atmosphere
   and other meaningful visual details where relevant.
7. Write descriptions in 1–3 sentences.
8. A description should add context beyond simply repeating the title.
9. Do not invent species, locations, camera details, events
   or other facts that cannot be established visually.
10. Collections should be concise, reusable categories.
11. Prefer an existing collection whenever the photograph
    reasonably fits one.
12. When selecting an existing collection, return its name
    EXACTLY as supplied, including capitalization.
13. Only create a new collection if none of the existing
    collections reasonably fits.
14. New collection names should be broad enough to accommodate
    similar photographs in the future.
15. Do not create unnecessary variations of existing categories.

Return valid JSON only.
`;

export async function generatePhotoMetadata({
  image,
  mimeType,
  title,
  collection,
  description,
  existingCollections,
}: PhotoMetadataInput): Promise<GeneratedMetadata> {
  const missingTitle = !title?.trim();
  const missingCollection = !collection?.trim();
  const missingDescription = !description?.trim();

  // Nothing to generate. Preserve the user's input.
  if (!missingTitle && !missingCollection && !missingDescription) {
    return {};
  }

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const requestedFields = [
    ...(missingTitle ? ["title"] : []),
    ...(missingCollection ? ["collection", "collectionIsNew"] : []),
    ...(missingDescription ? ["description"] : []),
  ];

  const prompt = `
Generate metadata for the attached photograph.

FIELDS TO GENERATE:
${requestedFields.join(", ")}

EXISTING COLLECTIONS:
${existingCollections.length
      ? existingCollections.map((item) => `- ${item}`).join("\n")
      : "No existing collections."}

USER-PROVIDED METADATA (preserve exactly):
Title: ${title?.trim() || "Not provided"}
Collection: ${collection?.trim() || "Not provided"}
Description: ${description?.trim() || "Not provided"}

You are an editorial photography curator. Your task is to generate thoughtful,
human-sounding metadata for photographs.

Generate only missing fields. Never overwrite or alter metadata supplied by
the user.

TITLE STYLE — IMPORTANT:
Titles must feel poetic, understated, evocative, and human-written.

The desired style is similar to titles found in a carefully curated
photography journal or fine-art photography collection.

Examples of the desired style:
- The Day Letting Go
- Wires Across the Evening
- A Brief Stopover
- Somewhere in Andromeda
- The Quiet Before Dusk
- Through the Last Rays
- Where the Sky Turns Wild
- A Little Bit of Orange
- Under a Yellow Sky
- Spring Has Its Ways
- The Colour of October
- Where the Light Gets In
- Looking Up at Spring
- An Ordinary Kind of Magic
- One More Sunset
- A Season in Bloom
- Wildflower Hours
- Little Things in White
- The Shape of Winter
- Somewhere Between Falling and Flowing
- Dancing in the Wind
- Mountains Behind the Mist
- A Mountain in Hiding
- Beyond the Blue
- Over Stones and Time
- The Trees Remember
- When the Leaves Turned
- A Forest Without Footsteps
- The Hills Went Quiet
- Where the Clouds Come to Rest

Title-writing rules:
- Prefer evocative phrases over literal descriptions.
- Capture the mood, atmosphere, light, season, movement, or feeling
  of the photograph.
- Use natural language, not elaborate or artificially literary vocabulary.
- Keep titles relatively short, usually 3–7 words.
- Use varied sentence structures. Do not repeatedly begin titles with
  "Where", "The", "A", or "Somewhere".
- Subtle imagery, gentle ambiguity, and a little emotional resonance
  are welcome.
- Make each title feel specific to its photograph.
- Avoid generic AI-sounding phrases such as "Nature's Beauty",
  "Serenity in Nature", "A Moment in Time", "Beauty of the Wild",
  or "Capturing the Essence".
- Do not simply identify the subject. "Yellow Flowers in Spring"
  is not a good title. "Spring Has Its Ways" is closer to the target.
- Do not force metaphors or invent a story that the photograph
  does not support.
- Avoid excessive punctuation, quotation marks, and subtitles.
- Do not copy any example title verbatim. Use them only as stylistic
  references.

DESCRIPTION STYLE:
- Maximum length: 220 characters, including spaces and punctuation.
- Ideal length: 100–170 characters.
- Write from the perspective of a photographer reflecting on the scene.
- Let the description feel like a small personal observation or thought
  connected to the moment, rather than a formal image analysis.
- Use natural, contemporary language with a subtle Gen-Z conversational
  touch. Keep it effortless, not slang-heavy or overly casual.
- It is okay to use first-person expressions like "I liked how...",
  "What caught my eye was...", or "I remember noticing..." occasionally,
  but do not force them into every description.
- Focus on what made the moment interesting to photograph:
  the light, composition, colours, atmosphere, a small detail,
  or something that caught the photographer's attention.
- Allow a little personality and emotion, but keep it genuine
  and grounded in what is actually visible.
- Use 1–2 concise sentences.
- Avoid sounding like a professional photography review,
  museum caption, travel brochure, or AI-generated image description.
- Avoid generic openings such as "This photograph captures..."
  or "In this image, we can see..."
- Do not invent memories, feelings, locations, events, or intentions
  that cannot be reasonably inferred from the photograph.
- Do not repeat the title or describe every visible detail.
- Avoid forced poetic language, excessive adjectives, internet slang,
  emojis, and unnecessary filler.
- Always produce a complete, natural-sounding description.
- Never exceed 220 characters.

COLLECTION:
Choose the most appropriate existing collection whenever possible.
Use the exact existing collection name, including capitalization.
Create a new collection only when none of the existing collections
reasonably fits the photograph.
Keep collection names short and broad enough to group related images.

Return valid JSON only, with these fields:
{
  "title": "string",
  "collection": "string",
  "collectionIsNew": false,
  "description": "string"
}
`;


  const imageDataUrl =
    `data:${mimeType};base64,${image.toString("base64")}`;

  const response = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    temperature: 0.2,
    max_completion_tokens: 450,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty metadata response.");
  }

  const generated = JSON.parse(content) as GeneratedMetadata;

  // Never overwrite fields supplied by the user.
  const result: GeneratedMetadata = {};

  if (missingTitle && typeof generated.title === "string") {
    const value = generated.title.trim();

    if (value) {
      result.title = value.slice(0, 100);
    }
  }

  if (missingDescription && typeof generated.description === "string") {
    const value = generated.description.trim();

    if (value) {
      result.description = value.slice(0, 220);
    }
  }

  if (missingCollection && typeof generated.collection === "string") {
    const value = generated.collection.trim();

    if (value) {
      const existingMatch = existingCollections.find(
        (item) => item.toLowerCase() === value.toLowerCase()
      );

      if (existingMatch) {
        result.collection = existingMatch;
        result.collectionIsNew = false;
      } else if (generated.collectionIsNew === true) {
        result.collection = value.slice(0, 40);
        result.collectionIsNew = true;
      }
    }
  }

  return result;
}
