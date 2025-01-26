import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon 추가 */}
        <link rel="icon" href="%PUBLIC_URL%/favicon.png" />
        {/* 추가적인 메타 태그 */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Educational Flashcard App for Kids" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
