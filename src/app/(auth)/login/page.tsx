"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { loginUser } from "@/lib/pocketbase";
import { useFormik } from "formik";

const validate = (values: any) => {
  const errors: any = {};

  if (!values.email) {
    errors.email = "Privalomas laukas";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Netinkamas e. pašto adresas";
  }

  if (!values.password) {
    errors.password = "Privalomas laukas";
  }

  return errors;
};

const Login = () => {
  const router = useRouter();

  const { mutate: mutateLoginUser, isPending, error } = loginUser();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validate,
    onSubmit: (values) => {
      mutateLoginUser(values);
    },
  });
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-11 sm:col-9 md:col-7 mx-auto">
              <div className="mb-14 text-center">
                <h2 className="max-md:h1 md:mb-2">Prisijungti</h2>
                <p className="md:text-lg">
                  Norėdami prisijungti, įveskite savo el. pašto adresą ir
                  slaptažodį
                </p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                <div>
                  <label className="form-label">Elektroninis paštas</label>
                  <input
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="mano@pastas.lt"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email ? (
                    <p className="font-medium text-red-500 truncate mt-2">
                      {formik.errors.email.toString()}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="form-label mt-8">Slaptažodis</label>
                  <input
                    className="form-input"
                    placeholder="********"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.errors.password ? (
                    <p className="font-medium text-red-500 truncate mt-2">
                      {formik.errors.password.toString()}
                    </p>
                  ) : null}
                </div>
                {error ? (
                  <p className="font-medium text-red-500 truncate mt-2">
                    {JSON.stringify(error)}
                  </p>
                ) : null}

                {/* {errorMessages.map((error) => (
                  <p
                    key={error.code}
                    className="font-medium text-red-500 truncate mt-2"
                  >
                    *
                    {error.code === "UNIDENTIFIED_CUSTOMER"
                      ? `${error.message}`
                      : "Invalid Email or Password"}
                  </p>
                ))} */}

                <button
                  type="submit"
                  className="btn btn-primary md:text-lg md:font-medium w-full mt-10"
                  disabled={isPending}
                >
                  {isPending ? (
                    <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
                  ) : (
                    "Prisijungti"
                  )}
                </button>
              </form>

              <div className="flex gap-x-2 text-sm md:text-base mt-4">
                <p className="text-light dark:text-darkmode-light">
                  Neturi paskyros?
                </p>
                <Link
                  className="underline font-medium text-dark dark:text-darkmode-dark"
                  href={"/sign-up"}
                >
                  Registruotis
                </Link>
              </div>
              <div className="flex gap-x-2 text-sm md:text-base mt-6">
                <Link
                  className="underline font-medium text-dark dark:text-darkmode-dark"
                  href={"/reset-password"}
                >
                  Pamiršau savo slaptažodį
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
