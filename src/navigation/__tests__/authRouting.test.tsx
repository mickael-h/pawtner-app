import { afterEach, describe, expect, it } from "@jest/globals";
import { act, render, screen } from "@testing-library/react-native";
import React from "react";

import { useAuthStore } from "../../store/authStore";
import IndexScreen from "../../../app/index";
import OAuthRedirectScreen from "../../../app/oauthredirect";
import PrivateLayout from "../../../app/(app)/_layout";

jest.mock("expo-router", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    Redirect: ({ href }: { href: string }) =>
      ReactModule.createElement(Text, { testID: "redirect-target" }, href),
    Stack: () => ReactModule.createElement(Text, { testID: "private-stack" }, "stack"),
  };
});

function setAuthState(
  state: Partial<Pick<ReturnType<typeof useAuthStore.getState>, "accessToken" | "refreshToken" | "hydrated" | "isLoading" | "errorCode">>,
) {
  act(() => {
    useAuthStore.setState(state);
  });
}

function resetAuthState() {
  setAuthState({
    accessToken: null,
    refreshToken: null,
    hydrated: false,
    isLoading: false,
    errorCode: null,
  });
}

describe("auth routing smoke", () => {
  afterEach(() => {
    resetAuthState();
  });

  it("RootIndex_hydrating_rendersLoader", () => {
    setAuthState({ hydrated: false, accessToken: null });
    render(<IndexScreen />);
    expect(screen.queryByTestId("redirect-target")).toBeNull();
  });

  it("RootIndex_unauthenticated_redirectsPublic", () => {
    setAuthState({ hydrated: true, accessToken: null });
    render(<IndexScreen />);
    expect(screen.getByTestId("redirect-target")).toHaveTextContent("/(public)");
  });

  it("RootIndex_authenticated_redirectsApp", () => {
    setAuthState({ hydrated: true, accessToken: "token" });
    render(<IndexScreen />);
    expect(screen.getByTestId("redirect-target")).toHaveTextContent("/(app)");
  });

  it("PrivateLayout_hydrating_rendersLoader", () => {
    setAuthState({ hydrated: false, accessToken: null });
    render(<PrivateLayout />);
    expect(screen.queryByTestId("redirect-target")).toBeNull();
    expect(screen.queryByTestId("private-stack")).toBeNull();
  });

  it("PrivateLayout_unauthenticated_redirectsLogin", () => {
    setAuthState({ hydrated: true, accessToken: null });
    render(<PrivateLayout />);
    expect(screen.getByTestId("redirect-target")).toHaveTextContent("/(auth)/login");
  });

  it("OAuthRedirect_hydrating_rendersLoader", () => {
    setAuthState({ hydrated: false, accessToken: null });
    render(<OAuthRedirectScreen />);
    expect(screen.queryByTestId("redirect-target")).toBeNull();
  });

  it("OAuthRedirect_authenticated_redirectsApp", () => {
    setAuthState({ hydrated: true, accessToken: "token" });
    render(<OAuthRedirectScreen />);
    expect(screen.getByTestId("redirect-target")).toHaveTextContent("/(app)");
  });
});
