import { mount } from "svelte";
import "./ui.css";
import OptionsApp from "./OptionsApp.svelte";

mount(OptionsApp, { target: document.getElementById("app")! });
