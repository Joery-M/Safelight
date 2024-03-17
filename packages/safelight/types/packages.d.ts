export interface Packages {
    name: string;
    version: string;
    private: boolean;
    dependencies: { [key: string]: Dependency };
    devDependencies?: { [key: string]: Dependency };
    optionalDependencies?: { [key: string]: Dependency };
}

export interface DependencyDependencies {
    [key: string]: Dependency;
}

export interface Dependency {
    from: string;
    version?: string;
    resolved: string;
    description?: string;
    license: string | License;
    author?: Author;
    homepage: string;
    repository?: string;
    dependencies?: DependencyDependencies;
}

export interface Author {
    name: string;
    url?: string;
    email?: string;
}

export interface License {
    type: string;
    url: string;
}

export interface DependencyWithName extends Dependency {
    name: string;
    isDev: boolean;
}
