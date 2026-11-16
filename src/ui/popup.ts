import { mount } from "svelte";
import "./ui.css";
import PopupApp from "./PopupApp.svelte";

mount(PopupApp, { target: document.getElementById("app")! });
