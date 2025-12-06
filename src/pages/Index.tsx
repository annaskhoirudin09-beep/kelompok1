import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Selamat Datang di Aplikasi Anda</h1>
        <p className="text-xl text-gray-600 mb-6">
          Mulai bangun proyek luar biasa Anda di sini!
        </p>
        <Link to="/login"> {/* Mengubah tautan ke halaman login */}
          <Button size="lg" className="px-8 py-4 text-lg">
            Lihat Dashboard Gerbang Parkir
          </Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;