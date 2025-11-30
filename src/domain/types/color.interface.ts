import type { ISize } from './size.interface';
import type { ReplaceProperty } from '../../../utils';

export interface IColor {
  id: number;
  name: string;
  images: string[];
  price: string;
  description: string;
  sizes: number[];
}

export type IColorWithSizes = ReplaceProperty<IColor, 'sizes', ISize[]>;
