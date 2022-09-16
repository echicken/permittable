import React from 'react';

const About = () => {
    return (
        <>
            <strong>permittable</strong> allows you to search building permits from the City of Toronto's <a href="https://open.toronto.ca/dataset/building-permits-cleared-permits-prior-years/">Open Data Catalogue</a>.
            <p />
            Data is currently available for building permits that were <em>cleared</em> from <strong>2001</strong> to <strong>2021</strong>.
            <p />
            <strong>permittable</strong> was created as a learning exercise, so expect bugs and oddities. Bug reports and feature requests are welcome on <a href="https://github.com/echicken/permittable">GitHub</a>; please feel free to create an <a href="https://github.com/echicken/permittable/issues">issue</a>.
        </>
    );
}

export default About;