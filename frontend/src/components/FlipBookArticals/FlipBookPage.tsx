import { memo } from 'react';
import type { FlipBookPageProps } from '../../utils/types/flipBookArtical';

const FlipBookPage: React.FC<FlipBookPageProps> = ({ imageUrl, altText }) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent text-center text-white">
      <img src={imageUrl} alt={altText || 'Photo gallery image'} className="h-full w-full object-contain" />
    </div>
  );
};
export default memo(FlipBookPage);
