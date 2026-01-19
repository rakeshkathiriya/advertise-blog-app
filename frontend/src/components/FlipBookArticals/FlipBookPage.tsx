import { memo } from 'react';
import type { FlipBookPageProps } from '../../utils/types/flipBookArtical';

const FlipBookPage: React.FC<FlipBookPageProps> = ({ imageUrl, altText }) => {
  return (
    <div className="flex h-[calc(100%-30px)] w-full items-center justify-center bg-transparent text-center">
      <img src={imageUrl} alt={altText || 'Photo gallery image'} className="h-full w-full object-fill" />
    </div>
  );
};
export default memo(FlipBookPage);
