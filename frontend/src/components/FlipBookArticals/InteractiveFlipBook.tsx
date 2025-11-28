import { ChevronLeft, ChevronRight, Facebook, Instagram } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useGetAllAdvertise } from '../../queries/adminPanel/advertise.query';
import { Spinner } from '../common/Spinner';
import FlipBookPage from './FlipBookPage';

const InteractiveFlipBook: React.FC = () => {
  const { data: adResponse, isLoading, isError } = useGetAllAdvertise();
  const flipBookRef = useRef<any>(null);

  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [isShowCover, setIsShowCover] = useState(true);

  const flipRight = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipLeft = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handlePageFlip = useCallback((e: any) => {
    setCurrentPageNumber(e.data + 1);
  }, []);

  useEffect(() => {
    if (!isLoading && adResponse?.data) {
      const timer = setTimeout(() => {
        setIsShowCover(false);
        flipBookRef.current?.pageFlip()?.flip(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, adResponse]);

  if (isError) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <div className="text-textPrimary">Error loading advertisements</div>
      </div>
    );
  }

  console.log('currentPageNumber :', adResponse && adResponse.data.length && adResponse.data.length % 2 === 0);

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center py-10">
      {isLoading && <Spinner className="bg-transparent! backdrop-blur-none!" />}
      {!isLoading && (
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
                <div className="relative flex">
                  {/* {index % 2 == 0 && (
                  <div className="absolute -left-10 h-full">
                    <ChevronLeft
                      onClick={flipLeft}
                      size={35}
                      className="bg-bgPrimary/30 relative top-[50%] cursor-pointer! rounded-full p-1"
                    />
                  </div>
                )} */}
                  <div
                    key={book._id}
                    className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!"
                  >
                    <FlipBookPage imageUrl={book.image} altText={'image'} />
                    <PageFooter index={index} />
                  </div>
                  {/* {index % 2 != 0 && (
                  <div className="absolute top-0 -right-10 h-full">
                    <ChevronRight
                      onClick={flipRight}
                      size={35}
                      className="bg-bgPrimary/30 relative top-[50%] cursor-pointer! rounded-full p-1"
                    />
                  </div>
                )} */}
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
    <div className="flex h-[50px] w-full items-center">
      {isShowIcon && (
        <div className="flex cursor-pointer items-center justify-center gap-3">
          <Facebook size={20} color="#4B5563" strokeWidth={2.5} />
          <Instagram size={20} color="#4B5563" strokeWidth={2.5} />
        </div>
      )}
      {isShowPage && (
        <div className="flex w-[55%]">
          <p className="text-textSecondary ml-auto text-sm font-semibold">{'Page ' + (index + 1)} </p>
        </div>
      )}
      <h4 className="text-textSecondary ml-auto text-sm font-semibold">© Smart Book 2025</h4>
    </div>
  );
};
