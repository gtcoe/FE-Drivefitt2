const TitleDescription = ({
  title,
  description,
  isBanner,
  className,
}: {
  title: string;
  description?: string;
  isBanner?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-3 md:gap-4 ${
        isBanner ? "!gap-2" : ""
      } ${className}`}
    >
      <h2
        className={`${
          !description ? "mb-2 md:mb-[48px]" : ""
        } text-2xl md:text-5xl font-semibold leading-7 md:leading-[56px] px-0 md:px-[120px] tracking-[-1px] md:tracking-[-2px] text-center px-[24px]`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`${
            isBanner
              ? "text-white max-w-full md:!max-w-[685px] md:!text-xl !leading-full !tracking-[-2%] !font-normal !mb-0"
              : ""
          } text-xs md:text-base font-light leading-4 md:leading-5 tracking-[-1%] text-[#8A8A8A] text-center mb-2 md:mb-[48px] md:max-w-[843px]`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default TitleDescription;
