import { mount } from "svelte";
import "./ui.css";
import DefaultPopupApp from "./DefaultPopupApp.svelte";

mount(DefaultPopupApp, { target: document.getElementById("app")! });
