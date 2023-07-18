import { Vector } from '../math';
import { getReversedImage, getScaledImage } from '../utils';
import { Drawable, type DrawableOptions } from './Drawable';
import { LayerDOM } from './layers/LayerDOM';
import { ImageNode } from './nodes/ImageNode';

export interface ImageOptions extends DrawableOptions {
  image: HTMLImageElement;
  flippable?: boolean;
  scale?: number;
}

type ImagesType = 'straight' | 'reversed';
type Images = Record<ImagesType, HTMLImageElement>;

export class Image extends Drawable {
  protected image!: HTMLImageElement;
  protected images!: Images;
  protected domNode!: ImageNode;
  protected source = new Vector();
  protected flipped = false;
  protected scale = 1;
  private loaded = false;

  constructor({
    x,
    y,
    layer,
    image,
    scale = 1,
    width = image.width,
    height = image.height,
    flippable = false,
  }: ImageOptions) {
    super({ x, y, width, height, layer });

    this.scale = scale;
    this.setImages(image, flippable);
  }

  protected createDomNode(): ImageNode {
    return new ImageNode({ layer: this.layer as LayerDOM, drawable: this });
  }

  private async setImages(
    image: HTMLImageElement,
    flippable: boolean
  ): Promise<void> {
    this.image = await getScaledImage(image, this.scale);

    if (flippable) {
      const reversed = await getReversedImage(this.image);
      this.images = {
        straight: this.image,
        reversed,
      };
    }

    this.loaded = true;
  }

  public getSource(): Vector {
    return this.source;
  }

  public getImage(): HTMLImageElement {
    return this.image;
  }

  public flip(): void {
    this.image = this.flipped ? this.images.straight : this.images.reversed;
    this.flipped = !this.flipped;

    this.domNode?.flip();
  }

  public draw(): void {
    this.loaded && this.layer.drawImage(this);
  }
}
