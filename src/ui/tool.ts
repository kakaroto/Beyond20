import { mount } from "svelte";
import "./ui.css";
import ToolApp from "./ToolApp.svelte";

mount(ToolApp, { target: document.getElementById("app")! });
