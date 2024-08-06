import { UploadImageForm } from './UploadImageForm';
import getUserSession from '@/lib/getUserSession';
import { redirect } from 'next/navigation';
import { Header } from '@/components/header';

export default async function ImageUploadPage() {
  const {
    data: { session },
  } = await getUserSession();

  if (!session) {
    return redirect('/login');
  }

  return (
    <>
      <Header />
      <UploadImageForm />
    </>
  );
}
