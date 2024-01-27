'use client';

import { useApp } from '@/context/ApplicationProvider';
import { CONFIGURE, FLEET } from '@/constants/paths';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const data = useApp();

  // prevent multiple pushes if page rerenders
  useEffect(() => {
    router.push(
      data.server && data.server.host !== '' && data.server.port !== ''
        ? FLEET
        : CONFIGURE,
    );
  }, []);

  return null;
}
