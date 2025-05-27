
export default function Footer() {
  return (
    <footer className="text-center p-4 dark:bg-gray-800 dark:text-white bg-gray-800 text-white">
      &copy; {new Date().getFullYear()} Iqbal Imaduddin. All rights reserved.
    </footer>
  );
}