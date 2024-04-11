import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

function Login() {
    const [err, setErr] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password)
            // localStorage.clear()
            // localStorage.setItem('currentUser', auth.currentUser.uid);
            navigate("/")
        } catch (err) {
            setErr(true);
        }
    };

    return (
        <div>
            <div className='formContainer' >
                <div className='formWrapper'>
                    <span className='logo' > Chat App</span>
                    <span className='title' logo>Login</span>
                    <form onSubmit={handleSubmit}>

                        <div class="mb-3 row">

                            <div class="col-sm-12">
                                <input type="email" class="form-control" id="email" placeholder='Email' />
                            </div>
                        </div>
                        <div class="mb-3 row">

                            <div class="col-sm-12">
                                <input type="password" class="form-control" id="password" placeholder='Enter Password' />
                            </div>
                        </div>

                        <button>Login</button>

                    </form>
                    <p>You do don't have an account ? <Link to="/Register">Register</Link></p>
                    {err && <span>Something went wrong</span>}
                </div>



            </div>
        </div>
    )
}

export default Login