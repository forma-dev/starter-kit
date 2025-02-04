import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { config } from '@/config';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen py-4 px-4">
      <Head>
        <title>Mint NFT - Forma Starter Kit</title>
        <meta
          content="Mint your new NFT"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">Forma Starter Kit</h1>
          <nav className="flex gap-6">
            <Link
              href="/"
              className={`${pathname === '/'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600 transition-colors'
                }`}
            >
              Home
            </Link>
            {config.contractAddress && (
              <>
                <Link
                  href="/mint"
                  className={`${pathname === '/mint'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600 transition-colors'
                    }`}
                >
                  Mint NFT
                </Link>
                <Link
                  href="/collection"
                  className={`${pathname === '/collection'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600 transition-colors'
                    }`}
                >
                  Collection
                </Link>
              </>
            )}
          </nav>
        </div>
        <ConnectButton />
      </header>

      <main className="flex flex-col items-center justify-center mb-16 mt-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;
