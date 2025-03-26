import { FC, useState } from "react";
import OpenAI from "openai";

import Container from "../common/Container/Container";
import Subtitle from "../common/Subtitle/Subtitle";
import Title from "../common/Title/Title";
import ImageSearch from "../ImageSearch/ImageSearch";

import styles from "./ImageGenerator.module.scss";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ImageGeneratorProps {}

const ImageGenerator: FC<ImageGeneratorProps> = () => {
  const [image, setImage] = useState(
    "https://cdn.home-designing.com/wp-content/uploads/2016/04/modern-art-deco-interior.jpg"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(
    "A high-accuracy picture captures a cozy apartment furnished with rustic pieces from designer brand Restoration Hardware, featuring a comfortable and inviting Cloud sofa that embodies the essence of relaxation, placed in front of a warm and inviting brick wall. The apartment evokes a charming and cozy design style with an impressive attention to detail, including high-end finishes from brands like"
  );

  function handlePrompt(value: string) {
    setPrompt(value);
  }

  async function fetchData() {
    try {
      setIsLoading(true);
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      });
      
      if (response.data && response.data.length > 0) {
        const url = response.data[0].url;
        setImage(url || "");
      } else {
        console.error("No images generated.");
      }
      
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }

  function handleButtonClick() {
    fetchData();
  }

  return (
    <section className={styles.ImageGenerator}>
      <Container>
        <div className={styles.ImageGenerator_subtitle}>
          <Subtitle label="Requests" />
        </div>
        <div className={styles.ImageGenerator_title}>
          <Title label="Interior Generator" />
        </div>
        <ImageSearch onChange={handlePrompt} onClick={handleButtonClick} />
        <div>
          {isLoading ? (
            <div className={styles.ImageGenerator__loading}>
              <p>Loading...</p>
              <p>Please wait until your image is ready.</p>
            </div>
          ) : (
            <div className={styles.ImageGenerator__img}>
              <img alt="interior" src={image} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ImageGenerator;
