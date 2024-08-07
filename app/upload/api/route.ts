import createSupabaseServerClient from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import getUserSession from '@/lib/getUserSession';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await getUserSession();

  if (!session) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = session.user;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tags = formData.get('tags') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage.from('images').upload(fileName, buffer, {
      contentType: file.type,
    });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(data.path);

    const { data: insertData, error: insertError } = await supabase.from('images').insert({
      file_path: publicUrl.publicUrl,
      created_by: user.id,
      tags: tags?.toLocaleLowerCase().split(',') || [],
      title: formData.get('title') || '',
      prompt: formData.get('prompt') || '',
      width: formData.get('width'),
      height: formData.get('height'),
      likes: 0,
      model: formData.get('model') || '',
      public: formData.get('public') || false,
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, url: publicUrl.publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
