
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_category_id_seq OWNER TO postgres;


ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;



CREATE TABLE public.product_attributes (
    attribute_id integer NOT NULL,
    product_id integer,
    attribute_name character varying(255) NOT NULL,
    attribute_value character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_attributes OWNER TO postgres;


CREATE SEQUENCE public.product_attributes_attribute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_attributes_attribute_id_seq OWNER TO postgres;


ALTER SEQUENCE public.product_attributes_attribute_id_seq OWNED BY public.product_attributes.attribute_id;


CREATE TABLE public.product_categories (
    product_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.product_categories OWNER TO postgres;


CREATE TABLE public.product_images (
    image_id integer NOT NULL,
    product_id integer,
    image_url character varying(255) NOT NULL,
    image_type character varying(50) NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_images OWNER TO postgres;

CREATE SEQUENCE public.product_images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_images_image_id_seq OWNER TO postgres;

ALTER SEQUENCE public.product_images_image_id_seq OWNED BY public.product_images.image_id;

CREATE TABLE public.product_tags (
    product_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.product_tags OWNER TO postgres;

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;



CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_product_id_seq OWNER TO postgres;

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;



CREATE TABLE public.tags (
    tag_id integer NOT NULL,
    tag_name character varying(50) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;


CREATE SEQUENCE public.tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_tag_id_seq OWNER TO postgres;

ALTER SEQUENCE public.tags_tag_id_seq OWNED BY public.tags.tag_id;


ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


ALTER TABLE ONLY public.product_attributes ALTER COLUMN attribute_id SET DEFAULT nextval('public.product_attributes_attribute_id_seq'::regclass);

ALTER TABLE ONLY public.product_images ALTER COLUMN image_id SET DEFAULT nextval('public.product_images_image_id_seq'::regclass);


ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);

ALTER TABLE ONLY public.tags ALTER COLUMN tag_id SET DEFAULT nextval('public.tags_tag_id_seq'::regclass);



ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (attribute_id);


ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (product_id, category_id);



ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (image_id);


ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, tag_id);


ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);


ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_tag_name_key UNIQUE (tag_name);


CREATE INDEX idx_product_attributes ON public.product_attributes USING btree (product_id);

CREATE INDEX idx_product_categories ON public.product_categories USING btree (category_id);

CREATE INDEX idx_product_images ON public.product_images USING btree (product_id);

CREATE INDEX idx_product_name ON public.products USING btree (name);


CREATE INDEX idx_product_tags ON public.product_tags USING btree (tag_id);


ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;



ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id) ON DELETE CASCADE;
