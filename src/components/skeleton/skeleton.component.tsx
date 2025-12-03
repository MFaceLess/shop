import styles from './skeleton.component.module.css';

interface ISkeletonComponentProps {
  width?: number;
  height?: number;
}

export const SkeletonComponent = ({ width, height }: ISkeletonComponentProps) => {
  return (
    <div 
      className={`${styles.skeleton}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  ) 
}