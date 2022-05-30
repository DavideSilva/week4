import { useState, useEffect } from "react";
import { providers, Contract } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json";

import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea
} from "@chakra-ui/react";

import { object, string, number } from "yup";

// type Inputs = InferType<typeof schema>;

const schema = object({
  name: string().required(),
  age: number().required().positive().integer(),
  address: string(),
});

export default function HookForm() {
  const [newGreeting, setNewGreeting] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

    useEffect(function () {
    (async function () {
      const provider = (await detectEthereumProvider()) as any;
      const ethers = new providers.Web3Provider(provider);
      provider.pollingInterval = 1000;

      const contract = new Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        Greeter.abi,
        ethers
      );

      ethers.on(contract.filters.NewGreeting(null), (event) => {
        setNewGreeting(event.data);
      });
    })();
  }, []);

  const onSubmit = async (values: any) => {
    await schema.validate(values);

    console.log(values);
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name || errors.age}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input {...register("name", {
            required: "This is required",
            minLength: { value: 2, message: "Name minimum length should be 2" },
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
        <FormLabel htmlFor="age">Age</FormLabel>
        <Input
          {...register("age", {
            required: "This is required",
            min: { value: 18, message: "Age should be 18+" },
          })}
        />
        <FormErrorMessage>{errors.age && errors.age.message}</FormErrorMessage>
        <FormLabel htmlFor="address">Address</FormLabel>
        <Input {...register("address", {})} />
      </FormControl>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
    <Textarea placeholder="New greeting placeholder" value={newGreeting} onChange={() => {}} marginTop="20px" />
    </>
  );
}
