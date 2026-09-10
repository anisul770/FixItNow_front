

const DashboardLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {

    return (
        <div>
            auth layout 
            {children}
        </div>
    );
};

export default DashboardLayout;