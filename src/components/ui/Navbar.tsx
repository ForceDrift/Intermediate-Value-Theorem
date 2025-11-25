import Link from 'next/link';

export default function Navbar() {
    const title = "Home"
    return (
        <nav className="">
            <ul className=''>
                <li>
                    <Link href="/">{title}</Link>
                </li>
                <li>
                    <Link href="/code">Code</Link>
                </li>
            </ul>
        </nav>
    );
}

