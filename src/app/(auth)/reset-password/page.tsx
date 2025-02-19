"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { passwordResetMutation } from "@/lib/pocketbase";
import { useFormik } from "formik";

const validate = (values: any) => {
  const errors: any = {};

  if (!values.email) {
    errors.email = "Privalomas laukas";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Netinkamas e. pašto adresas";
  }

  return errors;
};

const Page = () => {
  const router = useRouter();

  const {
    mutate: mutateResetPassword,
    isPending,
    error,
  } = passwordResetMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validate,
    onSubmit: (values) => {
      mutateResetPassword(values);
    },
  });
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-11 sm:col-9 md:col-7 mx-auto">
              <div className="mb-14 text-center">
                <h2 className="max-md:h1 md:mb-2">Slaptažodžio atkūrimas</h2>
                <p className="md:text-lg">Įveskite el. pašto adresą</p>
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
                {error ? (
                  <p className="font-medium text-red-500 truncate mt-2">
                    {JSON.stringify(error)}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-primary md:text-lg md:font-medium w-full mt-10 normal-case"
                  disabled={isPending}
                >
                  {isPending ? (
                    <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
                  ) : (
                    "Atkūrti slaptažodį"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
