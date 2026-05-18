'use client';

import Link from 'next/link';
import Head from 'next/head';


export default function Home() {

  const openSso = () => {
    window.location.href = '/sign-in'
  }

  return (
    <>
      <Head>
        <title>UNI ERP</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        :root {
          --primary-blue: #007bff !important;
          --dark-text: #212529 !important;
          --light-text: #6c757d !important;
          --background-color: #f8f9fa !important;
          --button-hover-blue: #0056b3 !important;
          --border-color: #e9ecef !important;
        }

        body {
          font-family: 'Inter', sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: var(--background-color) !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          min-height: 100vh !important;
          overflow: hidden !important;
        }

        .container {
          background-color: #fff !important;
          border-radius: 20px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
          width: 100% !important;
          max-width: 1200px !important;
          height: 90vh !important;
          display: flex !important;
          flex-direction: column !important;
          position: relative !important;
          padding: 40px !important;
          box-sizing: border-box !important;
          margin: auto !important;
        }

        .header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding-bottom: 30px !important;
        }

        .logo {
          display: flex !important;
          align-items: center !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          color: var(--dark-text) !important;
        }

        .logo-icon {
          width: 30px !important;
          height: 30px !important;
          background-color: var(--primary-blue) !important;
          border-radius: 8px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin-right: 10px !important;
        }

        .logo-icon svg {
          fill: #fff !important;
          width: 18px !important;
          height: 18px !important;
        }

        .nav-buttons button,
        .nav-buttons a.button {
          background: none !important;
          border: none !important;
          color: var(--light-text) !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          padding: 10px 20px !important;
          border-radius: 8px !important;
          transition: color 0.3s ease, background-color 0.3s ease !important;
          text-decoration: none !important;
          display: inline-block !important;
        }

        .nav-buttons button:hover,
        .nav-buttons a.button:hover {
          color: var(--dark-text) !important;
          background-color: var(--border-color) !important;
        }

        .sign-in {
          background-color: #f0f2f5 !important;
          color: var(--dark-text) !important;
          padding: 10px 25px !important;
        }

        .hero-section {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          flex-grow: 1 !important;
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }

        .hero-content {
          flex: 1 !important;
          max-width: 500px !important;
        }

        .hero-title {
          font-size: 64px !important;
          font-weight: 800 !important;
          color: var(--dark-text) !important;
          margin-bottom: 15px !important;
          line-height: 1.1 !important;
        }

        .hero-subtitle {
          font-size: 20px !important;
          color: var(--light-text) !important;
          margin-bottom: 30px !important;
          line-height: 1.6 !important;
        }

        .hero-buttons {
          display: flex !important;
          gap: 20px !important;
        }

        .btn {
          padding: 15px 30px !important;
          border-radius: 12px !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: background-color 0.3s ease, transform 0.2s ease !important;
          text-decoration: none !important;
        }

        .btn-primary {
          background-color: var(--primary-blue) !important;
          color: #fff !important;
          border: none !important;
        }

        .btn-primary:hover {
          background-color: var(--button-hover-blue) !important;
          transform: translateY(-2px) !important;
        }

        .btn-secondary {
          background: none !important;
          border: 2px solid var(--border-color) !important;
          color: var(--dark-text) !important;
        }

        .btn-secondary:hover {
          background-color: var(--border-color) !important;
          transform: translateY(-2px) !important;
        }

        .hero-image {
          flex: 1 !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative !important;
        }

        .hero-image img {
          width: 100% !important;
          max-width: 300px !important;
          height: auto !important;
          object-fit: contain !important;
          display: block !important;
        }

        .floating-dot {
          position: absolute !important;
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          filter: blur(1px) !important;
        }

        .dot-green {
          background-color: #5cb85c !important;
          top: 15% !important;
          right: 25% !important;
          transform: translate(50%, -50%) !important;
        }

        .dot-blue {
          background-color: var(--primary-blue) !important;
          bottom: 20% !important;
          left: 20% !important;
          transform: translate(-50%, 50%) !important;
        }

        .dot-orange {
          background-color: #ffc107 !important;
          bottom: 5% !important;
          right: 40% !important;
        }

        .bottom-elements {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-end !important;
          margin-top: auto !important;
          padding-top: 20px !important;
          font-size: 14px !important;
          color: var(--light-text) !important;
        }

        .read-more a {
          color: var(--light-text) !important;
          text-decoration: none !important;
          transition: color 0.3s ease !important;
        }

        .read-more a:hover {
          color: var(--dark-text) !important;
        }

        .background-elements {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }

        .bg-card-top-right {
          position: absolute !important;
          top: -50px !important;
          right: -100px !important;
          width: 400px !important;
          height: 300px !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 20px !important;
          transform: rotate(10deg) !important;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;p
          backdrop-filter: blur(10px) !important;
          opacity: 0.8 !important;
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          z-index: -1 !important;
        }

        .bg-card-bottom-right {
          position: absolute !important;
          bottom: -80px !important;
          right: -150px !important;
          width: 500px !important;
          height: 350px !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 20px !important;
          transform: rotate(-5deg) !important;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
          backdrop-filter: blur(10px) !important;
          opacity: 0.8 !important;
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          z-index: -1 !important;
        }
      `}</style>

      <div className="background-elements">
        <div className="bg-card-top-right"></div>
        <div className="bg-card-bottom-right"></div>
      </div>

      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
             
            </div>
            <span>Univerz</span>
          </div>
          <div className="nav-buttons">
            <button onClick={openSso} className="sign-in">Sign In</button>
            <button onClick={openSso} className="button">
              Register
            </button>
          </div>
        </header>

        <main className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">UNI ERP</h1>
            <p className="hero-subtitle">
              The Real-time & powerful database and data management application
              for web.
            </p>
            <div className="hero-buttons">
              <Link href="#" className="btn btn-primary">
                Launch App
              </Link>
              <Link href="#" className="btn btn-secondary">
                Explore More
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src="/assets/images/asset-landing.png" alt="3D Design Graphic" />
            <div className="floating-dot dot-green"></div>
            <div className="floating-dot dot-blue"></div>
            <div className="floating-dot dot-orange"></div>
          </div>
        </main>

        <footer className="bottom-elements">
          <div className="read-more">
            <Link href="#">← Read more</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
