{
  description = "Horn designer";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        nodejs = pkgs.nodejs_22;

        # Development dependencies
        devTools = with pkgs; [
          # Node
          nodejs
          bun
          biome
          dotenv-cli
          git
          lefthook
        ];

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = devTools;

          shellHook = ''
            echo "Node.js: $(node --version)"
            echo "Bun: $(bun --version)"
            echo "Biome: $(biome --version)"
            echo "Lefthook: $(lefthook version)"
            echo ""
            echo "Available commands:"
            echo "  bun install       - Install dependencies"
            echo "  bun run dev       - Start development server"
            echo "  bun run build     - Build for production"
            echo "  biome check .     - Lint and format check"
            echo "  biome format .    - Format code"
            echo "  lefthook install  - Install git hooks"
            echo "  dotenv -- <cmd>   - Run command with .env loadd
          '';
        };

        # Build the Vite application
        packages.default = pkgs.stdenv.mkDerivation {
          name = "horn-designer";
          src = ./.;

          buildInputs = [
            nodejs
            pkgs.bun
          ];

          buildPhase = ''
            export HOME=$TMPDIR
            bun install --frozen-lockfile
            bun run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r dist/* $out/
          '';
        };

        # Convenience app to run dev server
        apps.dev = {
          type = "app";
          program = toString (
            pkgs.writeShellScript "dev" ''
              export PATH=${pkgs.lib.makeBinPath devTools}:$PATH
              if [ ! -d "node_modules" ]; then
                echo "Installing dependencies..."
                bun install
              fi
              exec bun run dev
            ''
          );
        };

        # Convenience app to run with dotenv
        apps.dotenv = {
          type = "app";
          program = toString (
            pkgs.writeShellScript "dotenv-run" ''
              export PATH=${pkgs.lib.makeBinPath devTools}:$PATH
              exec dotenv -- "$@"
            ''
          );
        };
      }
    );
}
