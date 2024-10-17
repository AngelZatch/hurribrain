"use client";
import Button from "./../../ui/components/button";
import fetcher from "../../api/fetcher";
import useSWR from "swr";

const Tags = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8080/tags",
    fetcher
  );

  console.log(data, error, isLoading);

  return (
    <div>
      <h1>Tags</h1>
      <Button />
    </div>
  );
};

export default Tags;
