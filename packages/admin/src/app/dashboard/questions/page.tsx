"use client";
import fetcher from "../../api/fetcher";
import useSWR from "swr";

const Questions = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8080/questions",
    fetcher
  );

  console.log(data, error, isLoading);

  return (
    <div>
      <h1>Questions</h1>
    </div>
  );
};

export default Questions;
