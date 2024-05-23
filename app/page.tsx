import Landing from "@/components/Landing";

export default function Home() {
  return (
    <main className="bg-black h-screen flex flex-col justify-center items-center">
      <h2 className="text-white text-3xl font-semibold">Business Proposal Drafton</h2>
      <h2 className="text-white text-md pb-9">Login Now, to access the GPT</h2>
      <Landing />
    </main>
  );
}
