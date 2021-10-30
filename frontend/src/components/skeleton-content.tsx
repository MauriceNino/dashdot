import { FC } from "react";
import ContentLoader from "react-content-loader";
import { useTheme } from "styled-components";

type SkeletonContentProps = {
  height?: number;
  width?: number;
  borderRadius?: string;
};

const SkeletonContent: FC<SkeletonContentProps> = (props) => {
  const theme = useTheme();
  const height = props.height ?? 13;
  const width = props.height ?? 150;

  const child = props.children;
  let isFilled = true;

  if (child == null) {
    isFilled = false;
  } else if (typeof child === "string") {
    isFilled = child.trim().length > 0;
  } else if (typeof child === "boolean") {
    isFilled = child;
  }

  return (
    <>
      {isFilled ? (
        child
      ) : (
        <ContentLoader
          style={{
            borderRadius: props.borderRadius ?? "3px",
          }}
          width={width}
          height={height}
          backgroundColor={theme.colors.background}
          foregroundColor={theme.colors.surface}
        >
          <rect x="0" y="0" rx="2" ry="2" width="140" height={height} />
        </ContentLoader>
      )}
    </>
  );
};

export default SkeletonContent;
