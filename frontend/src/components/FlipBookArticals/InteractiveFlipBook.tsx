import { ChevronLeft, ChevronRight, Facebook, Instagram, Lock } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useGetAllAdvertise } from '../../queries/adminPanel/advertise.query';
import { freePageCount } from '../../utils/constants';
import { isUserForeverSubscribed } from '../../utils/helper';
import { Spinner } from '../common/Spinner';
import FlipBookPage from './FlipBookPage';

const InteractiveFlipBook: React.FC = () => {
  // States
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [isShowCover, setIsShowCover] = useState(true);
  const isForeverSubscribe = isUserForeverSubscribed();

  // Refs
  const flipBookRef = useRef<any>(null);

  // Api hooks
  const { data: adResponse, isLoading } = useGetAllAdvertise();

  // handlers
  const flipRight = useCallback(() => {
    const nextPage = currentPageNumber + 1;
    // Check if trying to go beyond free pages without subscription
    if (!isForeverSubscribe && nextPage > freePageCount) {
      setCurrentPageNumber(nextPage);
      return; // Don't flip
    }
    flipBookRef.current?.pageFlip()?.flipNext();
  }, [currentPageNumber, isForeverSubscribe]);

  const flipLeft = useCallback(() => {
    const prevPage = currentPageNumber - 1;
    if (prevPage >= 0) {
      setCurrentPageNumber(prevPage);
    }
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, [currentPageNumber]);

  const handlePageFlip = useCallback(
    (e: any) => {
      const nextPage = e.data + 1;
      // Check if trying to go beyond free pages without subscription
      if (!isForeverSubscribe && nextPage > freePageCount) {
        setCurrentPageNumber(nextPage);
        return; // Don't flip
      }
      setCurrentPageNumber(nextPage);
    },
    [isForeverSubscribe],
  );

  // effects
  useEffect(() => {
    if (!isLoading && adResponse?.data) {
      setIsShowCover(true);
      const timer = setTimeout(() => {
        setIsShowCover(false);
        flipBookRef.current?.pageFlip()?.flip(1);
        setCurrentPageNumber(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, adResponse]);

  const isOnRestrictedPage = !isForeverSubscribe && currentPageNumber > freePageCount;

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center py-10">
      {isLoading && <Spinner className="bg-transparent! backdrop-blur-none!" />}
      {!isLoading && isOnRestrictedPage && (
        <div className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center">
          <div className="space-y-6 text-center">
            <Lock size={64} className="mx-auto text-gray-400" />
            <h1 className="text-3xl font-bold text-gray-800">Subscribe to Continue</h1>
            <p className="text-lg text-gray-600">Unlock full access to all pages</p>
            <button className="bg-bgPrimary hover:bg-bgPrimaryDark mt-4 cursor-pointer rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-colors">
              Choose a Plan
            </button>
          </div>
        </div>
      )}
      {!isLoading && !isOnRestrictedPage && (
        <>
          {currentPageNumber > 1 && (
            <div className="absolute top-[50%] left-[calc(50%-550px)] z-10 -translate-y-1/2">
              <ChevronLeft onClick={flipLeft} size={35} className="bg-bgPrimary/30 cursor-pointer! rounded-full p-1" />
            </div>
          )}
          {currentPageNumber < (adResponse?.data?.length || 0) + 2 && (
            <div className="absolute top-[50%] right-[calc(50%-550px)] z-10 -translate-y-1/2">
              <ChevronRight
                onClick={flipRight}
                size={35}
                className="bg-bgPrimary/30 cursor-pointer! rounded-full p-1"
              />
            </div>
          )}
          <HTMLFlipBook
            {...({
              Key: 'flipBook',
              width: 500,
              height: 750,
              size: 'fixed',
              maxWidth: '100%',
              maxHeight: '100%',
              maxShadowOpacity: 0.5,
              drawShadow: true,
              showCover: isShowCover,
              flippingTime: 1000,
              mobileScrollSupport: true,
              onInit: handlePageFlip,
              onFlip: handlePageFlip,
              ref: flipBookRef,
              startPage: currentPageNumber,
              swipeDistance: 10,
              useMouseEvents: false,
              clickEventForward: true,
              disableFlipByClick: false,
              usePortrait: true,
            } as any)}
          >
            <div key="cover-page" className="relative flex">
              <div className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!">
                <FlipBookPage imageUrl={'/first.png'} altText={'image'} />
                <PageFooter index={0} isShowPage={false} isShowIcon={false} />
              </div>
            </div>

            {adResponse &&
              (adResponse?.data ?? []).map((book, index) => (
                <div className="relative flex" key={book._id}>
                  <div
                    key={book._id}
                    className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!"
                  >
                    <FlipBookPage imageUrl={book.image} altText={'image'} />
                    <PageFooter index={index} />
                  </div>
                </div>
              ))}

            {adResponse && adResponse.data.length % 2 !== 0 ? (
              <div key={'second-last-page'} className="relative flex">
                <div className="page bg-bgDefault border-borderMedium flex h-full min-h-full w-full flex-col items-center justify-end overflow-hidden border px-3! py-4!">
                  <PageFooter index={adResponse?.data.length} isShowPage={true} isShowIcon={false} />
                </div>
              </div>
            ) : (
              <></>
            )}

            <div key="last-page" className="relative flex">
              <div className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!">
                <FlipBookPage imageUrl={'/Last.png'} altText={'image'} />
                <PageFooter index={0} isShowPage={false} isShowIcon={false} />
              </div>
            </div>
          </HTMLFlipBook>
        </>
      )}
    </div>
  );
};
export default InteractiveFlipBook;

const PageFooter = ({
  index,
  isShowPage = true,
  isShowIcon = true,
}: {
  index: number;
  isShowPage?: boolean;
  isShowIcon?: boolean;
}) => {
  return (
    <div className="flex h-[50px] w-full items-center justify-center">
      {isShowIcon && (
        <div className="flex cursor-pointer items-center justify-center gap-3">
          <Facebook size={20} color="#4B5563" strokeWidth={2.5} />
          <Instagram size={20} color="#4B5563" strokeWidth={2.5} />
        </div>
      )}
      {isShowPage && (
        <div className="flex w-[40%]">
          <p className="text-textSecondary ml-auto text-sm font-semibold">{'Page ' + (index + 1)} </p>
        </div>
      )}
      <h4 className="text-textSecondary ml-auto text-sm font-semibold">© Food N Processing 2025</h4>
    </div>
  );
};
