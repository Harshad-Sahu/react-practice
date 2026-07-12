export type ImageData = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export type Post = {
  id: number;
  title: string;
  body: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
};

export type VirtualItem = {
  index: number;
  offsetTop: number;
  height: number;
};

export type VirtualizationConfig = {
  itemHeight: number;
  overscan: number;
  scrollingDelay: number;
};
