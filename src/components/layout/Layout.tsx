import OurNavbar from './NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <OurNavbar />
            <div className="content">{children}</div>
        </div>
    );
}