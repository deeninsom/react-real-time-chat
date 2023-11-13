const Auth = () => {

    

    return (
        <>
            <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">

                                    <h3 className="mb-5">Sign in</h3>

                                    <div className="form-outline mb-4">
                                        <input type="email" id="typeEmailX-2" placeholder="Email" className="form-control form-control-lg" />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input type="password" id="typePasswordX-2" placeholder="Password" className="form-control form-control-lg" />
                                    </div>

                                    <button className="btn btn-primary btn-lg btn-block" type="submit">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Auth