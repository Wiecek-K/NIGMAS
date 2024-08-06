import { Header } from '@/components/header';
import { LoginForm } from './login-form';

export default async function LoginPage() {
  return (
    <>
      <Header />

      <section className="min-h-screen bg-ct-blue-600 pt-20">
        <div className="container mx-auto flex h-full items-center justify-center px-6 py-12">
          <div className="bg-white px-8 py-10 md:w-8/12 lg:w-5/12">
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
