import { handleAuth } from "@/actions/handle-auth";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login')
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-10'>Protected Dashboard</h1>
      <p className='mb-10'>{session?.user?.email ? session?.user?.email : "Usuário não está logado!"}</p>
      {session?.user?.email && (
        <form
          action={handleAuth}
        >
          <button type="submit" className='border rounded-md p-2 cursor-pointer'>Logout</button>
        </form>
      )}

      <Link href='/pagamentos'>Pagamentos</Link>
    </div>
  );
}
