import { TITLE } from "@/constants/texts";
import Head from "next/head";

export const AppHeader = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <Head>
      <title key="title">
        {TITLE} | {title}
      </title>
      <meta name="description" content={description} key="description" />
    </Head>
  );
};
