import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  input: Yup.string()
    .min(8, "Mindestens 8 Zeichen erforderlich")
    .test(
      "sonderzeichen",
      "Muss 1-3 Sonderzeichen enthalten, die nicht aufeinander folgen",
      (value) => {
        if (!value) return false;
        const sonderzeichen = "!@#$%^&*(){}[]:;<>,.?~+-_=|/";
        let count = 0;
        let lastIndex = -2;
        for (let i = 0; i < value.length; i++) {
          if (sonderzeichen.includes(value[i])) {
            if (i - lastIndex === 1) return false; // Aufeinanderfolgende Sonderzeichen
            count++;
            lastIndex = i;
          }
        }
        return count >= 1 && count <= 3;
      },
    )
    .required("Eingabe ist erforderlich"),
});

function FormComponent() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate({ input });
      setError("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-blaugrau text-white dark:text-white border border-gruen dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gruen"
          placeholder="Geben Sie Text ein..."
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-blaugrau bg-gruen rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Senden
      </button>
      {error && (
        <div className="mt-4 p-2 bg-rot text-white rounded-md text-center transition duration-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-2 bg-mittelblau text-white rounded-md text-center transition duration-300">
          Eingabe erfolgreich validiert!
        </div>
      )}
    </form>
  );
}

export default FormComponent;
