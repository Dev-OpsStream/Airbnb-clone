import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
    return (
        <footer className="bg-gray-200 text-gray-800 py-2 w-full mt-8">
            <div className="container mx-auto flex flex-col items-center justify-center">
                <div className="flex space-x-4 mb-4">
                    <a href="https://www.facebook.com/ramraj.nagapure" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                        <i className="fa-brands fa-square-facebook text-2xl"></i>
                    </a>
                    <a href="https://www.instagram.com/ramrajnagapure/?__pwa=1" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                        <i className="fa-brands fa-square-instagram text-2xl"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/ramraj-nagapure-34ba54293/" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                        <i className="fa-brands fa-linkedin text-2xl"></i>
                    </a>
                </div>
                <div className="mb-4 text-center">
                    <p className="font-semibold">&copy; Wanderlust Private Limited</p>
                </div>
                <div className="flex space-x-4">
                    <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Terms</a>
                    <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Privacy</a>
                </div>
            </div>
        </footer>
    );
}
