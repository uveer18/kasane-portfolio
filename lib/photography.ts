export type Photograph = {
  src: string;
  thumbnail?: string;
  title: string;
  alt: string;
  description?: string;
  collection?: string;
  captureDate?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
};

export const photographs: Photograph[] = [
  { src: "/images/gallery/photo-1.jpg", title: "Solitary Mountain Peak Rising Above Quiet Valley at Golden Hour", alt: "Snow-capped mountain peak under clear blue sky with rugged surrounding mountains", collection: "Nature", width: 4000, height: 3000, aspectRatio: 4 / 3 },
  { src: "/images/gallery/photo-2.jpg", title: "Misty Himalayan Peaks Framed by Dark Pine Trees in Morning Light", alt: "Snow-covered mountain peak partially hidden by mist and framed by tall pine trees", collection: "Nature", width: 5605, height: 3153, aspectRatio: 5605 / 3153 },
  { src: "/images/gallery/photo-3.jpg", title: "Golden Wild Grass Swaying Gently Against Clear Blue Autumn Sky", alt: "Tall golden grass plants blowing in wind under bright blue sky", collection: "Nature", width: 4000, height: 6000, aspectRatio: 2 / 3 },
  { src: "/images/gallery/photo-4.jpg", title: "Soft Waterfall Cascading Down Mossy Cliff in Mountain Forest", alt: "Long exposure photograph of waterfall flowing down rocky cliff face", collection: "Nature", width: 3374, height: 5998, aspectRatio: 3374 / 5998 },
  { src: "/images/gallery/photo-5.jpg", title: "Delicate White Daisy Flowers Blooming Among Deep Green Leaves", alt: "Close-up of white daisy flowers with dark centers surrounded by green foliage", collection: "Nature", width: 4278, height: 5706, aspectRatio: 4278 / 5706 },
  { src: "/images/gallery/photo-6.jpg", title: "Sunlit River Flowing Over Rocky Streambed Through Forest Clearing", alt: "Small river with rocks reflecting sunlight surrounded by trees", collection: "Nature", width: 3804, height: 5074, aspectRatio: 3804 / 5074 },
];
