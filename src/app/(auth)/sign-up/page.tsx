"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { createUser } from "@/lib/pocketbase";
import { Field, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Image from "next/image";
import askezeImg from "../../../../public/images/askezes.png";
import { toast } from "react-toastify";

interface FormFieldGenericProps {
  image?: any;
  name: string;
  label: string;
  type?: string;
  onChange: any;
  error?: string;
  required: boolean;
}

interface FormFieldInputProps extends FormFieldGenericProps {
  value: string;
  placeholder?: string;
}

interface FormFieldCheckboxProps extends FormFieldGenericProps {
  value: boolean;
}

interface FormField {
  [key: string]: {
    image?: any;
    type?: string;
    placeholder?: string;
    label: string;
    required: boolean;
    componentType: "input" | "checkbox" | "textarea";
    checkError: (value: string | boolean) => string;
  };
}

function nonEmptyAndChecked(value: any) {
  if (typeof value === "string" || value instanceof String) {
    return value?.trim() !== "" ? "" : "Privalomas laukas";
  }
  return value ? "" : "Privalomas laukas";
}

function isPositiveNumericCheck(value: string | boolean) {
  if (typeof value === "string") {
    return /^\d+$/.test(value) ? "" : "Turi būti skaičius";
  }
  return "Turi būti skaičius";
}

const fields: FormField = {
  name: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: "Tavo vardas",
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  email: {
    type: "email",
    placeholder: "Tavo atsakymas",
    label: "Elektroninis paštas",
    required: true,
    componentType: "input",
    checkError: (value: string | boolean) => {
      if (typeof value === "string") {
        if (value.trim() === "") {
          return "Privalomas laukas";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          return "Netinkamas e. pašto adresas";
        } else {
          return "";
        }
      } else {
        return "Privalomas laukas";
      }
    },
  },
  age: {
    type: "number",
    placeholder: "Tavo atsakymas",
    label: "Amžius",
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  participatedBefore: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Ar jau esi dalyvavusi "Kviečio grūdo" gavėnios programoje moterims?`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  whyWantToJoin: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Kodėl norėtum dalyvauti "Kviečio grūdo" iššūkyje? Kokios priežastys paskatino? (pasidalink tiek, kiek nori/gali)`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  agreeToAscesis: {
    label: `Sutinku stengtis laikytis visų "Kviečio grūdo" iššūkio punktų`,
    required: true,
    componentType: "checkbox",
    checkError: nonEmptyAndChecked,
    image: askezeImg,
  },
  whichAscesisPointIsHardestWhy: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Kuris "Kviečio grūdo" iššūkio punktas Tau atrodo pats sunkiausias? Kaip manai, kodėl?`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  areYouPartOfFraternity: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Ar jau turi moterų grupelę, su kuria dalyvausi "Kviečio grūdo" iššūkyje? (taip pat jei esi grupelės moderatorė - parašyk tai, kad programos metu galėtume Tave palaikyti. Jei neturi grupelės, bet norėtum, kad Tave pakviestų prisijungti - čia taip pat gali tai parašyti)`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  city: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Kokiame mieste gyveni?`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  areYouPartOfChurchOrganization: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Ar priklausai kokiai nors krikščioniškai bendruomenei/parapijai? Jei taip - kokiai?`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  expectations: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Ko tikiesi iš šios programos?`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  anchorCorrectExpectations: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Ši programa turi labai aiškią pradžią ir pabaigą (šv. Velykos). Ar supranti, kad su "kviečio grūdo" sese Tu mokaisi atvirumo ir gali patirti tarpusavio bendrystę, tačiau neturėtum į kitą asmenį sudėti per didelių lūkesčių ir tikėtis nuolatinio palaikymo už programos ribų, ypač jai pasibaigus?`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  groupCoordinatorDescription: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Jei esi grupelės koordinatorė - šioje anketos skiltyje trumpai aprašyk savo grupelę (nurodyk dalyvių skaičių, ar pirmą kartą dalyvaujate "Kviečio grūdo" iššūkyje, ar susibūrėte tik šiam konkrečiam gavėnios laikui (o gal jau kuris laikas kartu keliaujate tikėjimo kelionę?),  ir pan.) .`,
    required: false,
    componentType: "textarea",
    checkError: nonEmptyAndChecked,
  },
  wishes: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `Ko norėtum palinkėti kitoms "Kviečio grūdo" iššūkio dalyvėms?`,
    required: false,
    componentType: "textarea",
    checkError: nonEmptyAndChecked,
  },
  password: {
    type: "password",
    placeholder: "********",
    label: `Slaptažodis`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  passwordConfirm: {
    type: "password",
    placeholder: "********",
    label: `Pakartok Slaptažodį`,
    required: true,
    componentType: "input",
    checkError: nonEmptyAndChecked,
  },
  agreeToCallAnchor: {
    type: "text",
    label: `Programos metu (iki šv. Velykų) įsipareigoju kiekvieną dieną susiskambinti su "kviečio grūdo" sese. Ištikimai laikysiuos šio įsipareigojimo, kuris liečia ne tik Mane, bet ir kitą asmenį.`,
    required: true,
    componentType: "checkbox",
    checkError: nonEmptyAndChecked,
  },
  spiritualFormationOwnResponsibility: {
    type: "text",
    placeholder: "Tavo atsakymas",
    label: `"Kviečio grūdo" iššūkis yra priemonė (ne tikslas!), galinti padėti Tau gilinti santykį su Dievu ir tikėjimo sesėmis, programa taip pat yra įrankis, galintis padėti stiprinti Tavo valią. Suprantu, kad už savo augimą ir dvasinį tobulėjimą esu atsakinga visų pirma Aš pati.`,
    required: true,
    componentType: "checkbox",
    checkError: nonEmptyAndChecked,
  },
  readChallengeDescription: {
    label: `Perskaičiau "Kviečio grūdo" programos aprašą. (Svarbu pačiai gerai suprasti, kur renkiesi dalyvauti)`,
    required: true,
    componentType: "checkbox",
    checkError: nonEmptyAndChecked,
  },
  bookReadNewsletter: {
    placeholder: "Tavo atsakymas",
    label: `Naujienlaiškyje norėčiau papildomai gauti knygų skaitinių.`,
    required: false,
    componentType: "checkbox",
    checkError: nonEmptyAndChecked,
  },
};

const initialValues = Object.entries(fields).reduce((acc, [key, value]) => {
  if (value.componentType === "checkbox") {
    return {
      ...acc,
      [key]: false,
    };
  }
  return { ...acc, [key]: "" };
}, {});

type FormData = {
  [key: string]: string | boolean;
};

const FormInput = ({
  name,
  type,
  onChange,
  value,
  placeholder,
  error,
  label,
  required,
}: FormFieldInputProps) => (
  <div>
    <label className="form-label text-m mt-8">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      name={name}
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
    {error ? <p className="text-red-500 text-s italic">{error}</p> : null}
  </div>
);

const FormTextArea = ({
  name,
  onChange,
  value,
  placeholder,
  error,
  label,
  required,
}: FormFieldInputProps) => (
  <div>
    <label className="form-label text-m mt-8">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      name={name}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      rows={4}
    />
    {error ? <p className="text-red-500 text-s italic">{error}</p> : null}
  </div>
);

const FormCheckbox = ({
  name,
  onChange,
  value,
  label,
  error,
  image,
  required,
}: FormFieldCheckboxProps) => (
  <div className="flex flex-col mt-8 gap-2">
    {image && (
      <Image
        src={image}
        className="mx-auto w-[388px] lg:w-[507px]"
        width={507}
        height={385}
        alt="paveikslelis"
        priority
      />
    )}
    <div className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
      <input
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        name={name}
        type="checkbox"
        onChange={onChange}
        value={Number(value)}
      />
      <label
        htmlFor="bordered-checkbox-1"
        className="w-full py-4 ms-2 text-m text-gray-900 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    </div>

    {error ? <p className="text-red-500 text-s italic">{error}</p> : null}
  </div>
);

function validate(values: FormData) {
  const errors = Object.entries(values).reduce((errors, [key, value]) => {
    if (!fields[key].required) {
      return errors;
    }
    const checkError = fields[key]?.checkError(value);
    return checkError
      ? {
          ...errors,
          [key]: checkError,
        }
      : errors;
  }, {});
  // const errorCount = Object.keys(errors).length;

  // if (errorCount > 0) {
  //   toast.error(`Registracijos klaidų skaičius: ${Object.keys(errors).length}`);
  // }
  return errors;
}

const SignUp = () => {
  const router = useRouter();

  const { mutate: createNewUser, isPending, error } = createUser();

  const formik = useFormik<FormData>({
    initialValues,
    validateOnChange: true,
    validate,
    onSubmit: (values: any) => {
      const { name, email, password, passwordConfirm, ...info } = values;
      const data = {
        name,
        email,
        password,
        passwordConfirm,
        emailVisibility: true,
        info,
      };
      createNewUser(data);
    },
  });

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-11 sm:col-9 md:col-7 mx-auto">
              <div className="mb-14 text-center">
                <h2 className="max-md:h1 md:mb-2">Susikurk paskyrą</h2>
                <p className="md:text-lg">Ir prisijunk prie iššūkio!</p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                {Object.entries(fields).map(([key, value]) => {
                  if (value.componentType === "checkbox") {
                    return (
                      <FormCheckbox
                        key={key}
                        name={key}
                        image={value?.image}
                        required={value.required}
                        label={value.label}
                        onChange={formik.handleChange}
                        value={!!formik.values[key]}
                        error={formik.errors[key]}
                      />
                    );
                  } else if (value.componentType === "input") {
                    return (
                      <FormInput
                        key={key}
                        name={key}
                        type={value.type}
                        image={value?.image}
                        required={value.required}
                        label={value.label}
                        placeholder={value.placeholder}
                        onChange={formik.handleChange}
                        value={formik.values[key].toString()}
                        error={formik.errors[key]}
                      />
                    );
                  } else if (value.componentType === "textarea") {
                    return (
                      <FormTextArea
                        key={key}
                        name={key}
                        type={value.type}
                        image={value?.image}
                        required={value.required}
                        label={value.label}
                        placeholder={value.placeholder}
                        onChange={formik.handleChange}
                        value={formik.values[key].toString()}
                        error={formik.errors[key]}
                      />
                    );
                  }
                  return null;
                })}
                <button
                  type="submit"
                  className="btn btn-primary md:text-lg md:font-medium w-full mt-10"
                  disabled={isPending}
                >
                  {isPending ? (
                    <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
                  ) : (
                    "Registruotis"
                  )}
                </button>
                {error ? (
                  <p className="text-red-500 text-s italic">{error.message}</p>
                ) : null}
                {formik.errors && Object.keys(formik.errors).length > 0 ? (
                  <p className="text-red-500 text-s italic">{`Registracijos klaidų skaičius: ${Object.keys(formik.errors).length}`}</p>
                ) : null}
              </form>

              <div className="flex gap-x-2 text-sm md:text-base mt-6">
                <p className="text-light dark:text-darkmode-light">
                  I have read and agree to the
                </p>
                <Link
                  className="underline font-medium text-dark dark:text-darkmode-dark"
                  href={"/terms-services"}
                >
                  Terms & Conditions
                </Link>
              </div>

              <div className="flex gap-x-2 text-sm md:text-base mt-2">
                <p className="text-light dark:text-darkmode-light">
                  Have an account?
                </p>
                <Link
                  className="underline font-medium text-dark dark:text-darkmode-dark"
                  href={"/login"}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
