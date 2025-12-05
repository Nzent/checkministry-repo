import NewOrderForm from "@/components/NewOrderForm"

const page = () => {
    return (
        <section>
            <h1 className="text-4xl">CheckMinistry</h1>
            <h2 className="my-4 font-bold">New Order</h2>
            <div>
                <NewOrderForm />
            </div>
        </section>
    )
}

export default page
