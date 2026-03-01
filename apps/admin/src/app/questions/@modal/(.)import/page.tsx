"use client";
import FileInput from "@/app/components/FileInput";
import { Modal } from "@/app/components/modal";
import HBIconButton from "@/app/components/ui/hbIconButton";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ArrowDownTrayIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import HBButton from "@/app/components/ui/hbButton";
import { importQuestions } from "../../actions";
import { ImportFormInputs } from "@/app/types/question";

const ImportQuestionsPage = () => {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<ImportFormInputs>();

  const onSubmit: SubmitHandler<ImportFormInputs> = async (data) => {
    console.log("SUBMIT", data);
    importQuestions(data);
  };

  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
      >
        <div className="h-[80px] px-2.5 py-5 w-full justify-between items-center inline-flex">
          <span className="text-[24px] font-bold">
            Importer une liste de questions
          </span>
          <HBIconButton icon={<XMarkIcon />} onClick={() => router.back()} />
        </div>
        <div className="grow px-2.5 py-5 w-full flex-col justify-start items-start gap-5 inline-flex">
          <a
            download
            href="/downloads/hurribrain_template.csv"
            className="w-full"
          >
            <HBButton
              label="Télécharger le modèle"
              size="large"
              color="secondary"
              startIcon={<ArrowDownTrayIcon />}
              fullWidth
            />
          </a>
          <details>
            <summary className="flex flex-row p-2.5 gap-2.5 justify-start items-center cursor-pointer">
              <InformationCircleIcon height={24} />
              <p className="font-bold">Aide à l&apos;utilisation du modèle</p>
            </summary>
            <p>
              Le modèle est un fichier .csv contenant les champs{" "}
              <strong>title</strong>, <strong>choices</strong> et{" "}
              <strong>tags</strong>. Ils sont séparés par un{" "}
              <strong>point-virgule</strong> (;)
            </p>
            <ul className="pl-2.5 list-disc list-inside [&_ul]:list-[revert]">
              <li>
                Remplissez <strong>title</strong> avec l&apos;intitulé de la
                question. N&apos;utilisez pas de guillemets !
              </li>
              <li>
                Remplissez <strong>choices</strong> avec les quatre choix de
                réponse
              </li>
              <ul className="pl-8">
                <li>Les choix doivent être séparés par une virgule (,)</li>
                <li>
                  Le premier choix donné sera considéré comme le choix correct.
                </li>
              </ul>
              <li>
                Remplissez <strong>tags</strong> avec les thèmes de la question
              </li>
              <ul className="pl-8">
                <li>Les tags doivent être séparés par une virgule (,)</li>
                <li>
                  Utilisez les noms exacts des thèmes. Les thèmes introuvables
                  seront ignorés.
                </li>
              </ul>
            </ul>
          </details>
          <Controller
            control={control}
            name="file"
            render={({ field: { onChange, value, name, ref } }) => (
              <FileInput
                name={name}
                onChange={onChange}
                value={value}
                ref={ref}
              />
            )}
          />
        </div>
        <div className="h-[76px] px-2.5 py-5 w-full justify-end items-center gap-2.5 inline-flex">
          <HBButton
            type="reset"
            label="Annuler"
            color="primary"
            variant="text"
            size="medium"
            onClick={() => router.back()}
          />
          <HBButton
            label="Importer"
            type="submit"
            size="medium"
            disabled={!formState.isValid}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ImportQuestionsPage;
