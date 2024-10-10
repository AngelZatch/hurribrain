export async function getQuestions(request: Request) {
  const res = await fetch("localhost:8080/questions", {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return Response.json({ questions: res.json() });
}