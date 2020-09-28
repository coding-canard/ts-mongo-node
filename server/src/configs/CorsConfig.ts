import { __PROD__ } from '../Constants';

export const corsConfig = __PROD__ ? 
{
  origin: "http://localhost:3000",
  credentials: true
} : {
  origin: "https://my-website.com",
  credentials: true
};