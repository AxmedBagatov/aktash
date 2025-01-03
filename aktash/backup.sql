PGDMP     %    '        	        |         
   db_vueshop %   14.15 (Ubuntu 14.15-0ubuntu0.22.04.1) %   14.15 (Ubuntu 14.15-0ubuntu0.22.04.1) I    }           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ~           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384 
   db_vueshop    DATABASE     _   CREATE DATABASE db_vueshop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE db_vueshop;
                postgres    false            �            1259    16454 
   categories    TABLE       CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    16453    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false    219            �           0    0    categories_category_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;
          public          postgres    false    218            �            1259    24646    images    TABLE     ^  CREATE TABLE public.images (
    image_id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer NOT NULL,
    image_url character varying(255) NOT NULL,
    image_type character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_order integer DEFAULT 1 NOT NULL
);
    DROP TABLE public.images;
       public         heap    postgres    false            �            1259    16397    images_backups    TABLE     (  CREATE TABLE public.images_backups (
    image_id integer NOT NULL,
    product_id integer,
    image_url character varying(255) NOT NULL,
    image_type character varying(50) NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 "   DROP TABLE public.images_backups;
       public         heap    postgres    false            �            1259    24645    images_image_id_seq    SEQUENCE     �   CREATE SEQUENCE public.images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.images_image_id_seq;
       public          postgres    false    222            �           0    0    images_image_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.images_image_id_seq OWNED BY public.images.image_id;
          public          postgres    false    221            �            1259    16411    product_attributes    TABLE       CREATE TABLE public.product_attributes (
    attribute_id integer NOT NULL,
    product_id integer,
    attribute_name character varying(255) NOT NULL,
    attribute_value character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 &   DROP TABLE public.product_attributes;
       public         heap    postgres    false            �            1259    16410 #   product_attributes_attribute_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_attributes_attribute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.product_attributes_attribute_id_seq;
       public          postgres    false    214            �           0    0 #   product_attributes_attribute_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.product_attributes_attribute_id_seq OWNED BY public.product_attributes.attribute_id;
          public          postgres    false    213            �            1259    16464    product_categories    TABLE     n   CREATE TABLE public.product_categories (
    product_id integer NOT NULL,
    category_id integer NOT NULL
);
 &   DROP TABLE public.product_categories;
       public         heap    postgres    false            �            1259    16396    product_images_image_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.product_images_image_id_seq;
       public          postgres    false    212            �           0    0    product_images_image_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.product_images_image_id_seq OWNED BY public.images_backups.image_id;
          public          postgres    false    211            �            1259    16434    product_tags    TABLE     c   CREATE TABLE public.product_tags (
    product_id integer NOT NULL,
    tag_id integer NOT NULL
);
     DROP TABLE public.product_tags;
       public         heap    postgres    false            �            1259    16386    products    TABLE     R  CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_id integer NOT NULL
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    16385    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    210            �           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    209            �            1259    16426    tags    TABLE     g   CREATE TABLE public.tags (
    tag_id integer NOT NULL,
    tag_name character varying(50) NOT NULL
);
    DROP TABLE public.tags;
       public         heap    postgres    false            �            1259    16425    tags_tag_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.tags_tag_id_seq;
       public          postgres    false    216            �           0    0    tags_tag_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.tags_tag_id_seq OWNED BY public.tags.tag_id;
          public          postgres    false    215            �            1259    32838    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    32837    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    224            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    223            �           2604    16457    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    24649    images image_id    DEFAULT     r   ALTER TABLE ONLY public.images ALTER COLUMN image_id SET DEFAULT nextval('public.images_image_id_seq'::regclass);
 >   ALTER TABLE public.images ALTER COLUMN image_id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    16400    images_backups image_id    DEFAULT     �   ALTER TABLE ONLY public.images_backups ALTER COLUMN image_id SET DEFAULT nextval('public.product_images_image_id_seq'::regclass);
 F   ALTER TABLE public.images_backups ALTER COLUMN image_id DROP DEFAULT;
       public          postgres    false    212    211    212            �           2604    16414    product_attributes attribute_id    DEFAULT     �   ALTER TABLE ONLY public.product_attributes ALTER COLUMN attribute_id SET DEFAULT nextval('public.product_attributes_attribute_id_seq'::regclass);
 N   ALTER TABLE public.product_attributes ALTER COLUMN attribute_id DROP DEFAULT;
       public          postgres    false    213    214    214            �           2604    16389    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    209    210    210            �           2604    16429    tags tag_id    DEFAULT     j   ALTER TABLE ONLY public.tags ALTER COLUMN tag_id SET DEFAULT nextval('public.tags_tag_id_seq'::regclass);
 :   ALTER TABLE public.tags ALTER COLUMN tag_id DROP DEFAULT;
       public          postgres    false    216    215    216            �           2604    32841    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            u          0    16454 
   categories 
   TABLE DATA           \   COPY public.categories (category_id, name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    219   �X       x          0    24646    images 
   TABLE DATA           r   COPY public.images (image_id, entity_type, entity_id, image_url, image_type, created_at, image_order) FROM stdin;
    public          postgres    false    222   �Z       n          0    16397    images_backups 
   TABLE DATA           m   COPY public.images_backups (image_id, product_id, image_url, image_type, is_primary, created_at) FROM stdin;
    public          postgres    false    212   B\       p          0    16411    product_attributes 
   TABLE DATA           s   COPY public.product_attributes (attribute_id, product_id, attribute_name, attribute_value, created_at) FROM stdin;
    public          postgres    false    214   _\       v          0    16464    product_categories 
   TABLE DATA           E   COPY public.product_categories (product_id, category_id) FROM stdin;
    public          postgres    false    220   |\       s          0    16434    product_tags 
   TABLE DATA           :   COPY public.product_tags (product_id, tag_id) FROM stdin;
    public          postgres    false    217   �\       l          0    16386    products 
   TABLE DATA           m   COPY public.products (product_id, name, description, price, created_at, updated_at, category_id) FROM stdin;
    public          postgres    false    210   �\       r          0    16426    tags 
   TABLE DATA           0   COPY public.tags (tag_id, tag_name) FROM stdin;
    public          postgres    false    216   @]       z          0    32838    users 
   TABLE DATA           H   COPY public.users (id, username, password_hash, created_at) FROM stdin;
    public          postgres    false    224   �]       �           0    0    categories_category_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq', 22, true);
          public          postgres    false    218            �           0    0    images_image_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.images_image_id_seq', 23, true);
          public          postgres    false    221            �           0    0 #   product_attributes_attribute_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.product_attributes_attribute_id_seq', 6, true);
          public          postgres    false    213            �           0    0    product_images_image_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.product_images_image_id_seq', 1, false);
          public          postgres    false    211            �           0    0    products_product_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.products_product_id_seq', 6, true);
          public          postgres    false    209            �           0    0    tags_tag_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.tags_tag_id_seq', 3, true);
          public          postgres    false    215            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 33, true);
          public          postgres    false    223            �           2606    16463    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    219            �           2606    24653    images images_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (image_id);
 <   ALTER TABLE ONLY public.images DROP CONSTRAINT images_pkey;
       public            postgres    false    222            �           2606    16419 *   product_attributes product_attributes_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (attribute_id);
 T   ALTER TABLE ONLY public.product_attributes DROP CONSTRAINT product_attributes_pkey;
       public            postgres    false    214            �           2606    16468 *   product_categories product_categories_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (product_id, category_id);
 T   ALTER TABLE ONLY public.product_categories DROP CONSTRAINT product_categories_pkey;
       public            postgres    false    220    220            �           2606    16404 "   images_backups product_images_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.images_backups
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (image_id);
 L   ALTER TABLE ONLY public.images_backups DROP CONSTRAINT product_images_pkey;
       public            postgres    false    212            �           2606    16438    product_tags product_tags_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, tag_id);
 H   ALTER TABLE ONLY public.product_tags DROP CONSTRAINT product_tags_pkey;
       public            postgres    false    217    217            �           2606    16395    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    210            �           2606    16431    tags tags_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public            postgres    false    216            �           2606    16433    tags tags_tag_name_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_tag_name_key UNIQUE (tag_name);
 @   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_tag_name_key;
       public            postgres    false    216            �           2606    32844    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    224            �           2606    32846    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    224            �           1259    16452    idx_product_attributes    INDEX     [   CREATE INDEX idx_product_attributes ON public.product_attributes USING btree (product_id);
 *   DROP INDEX public.idx_product_attributes;
       public            postgres    false    214            �           1259    16479    idx_product_categories    INDEX     \   CREATE INDEX idx_product_categories ON public.product_categories USING btree (category_id);
 *   DROP INDEX public.idx_product_categories;
       public            postgres    false    220            �           1259    16451    idx_product_images    INDEX     S   CREATE INDEX idx_product_images ON public.images_backups USING btree (product_id);
 &   DROP INDEX public.idx_product_images;
       public            postgres    false    212            �           1259    16449    idx_product_name    INDEX     E   CREATE INDEX idx_product_name ON public.products USING btree (name);
 $   DROP INDEX public.idx_product_name;
       public            postgres    false    210            �           1259    16450    idx_product_tags    INDEX     K   CREATE INDEX idx_product_tags ON public.product_tags USING btree (tag_id);
 $   DROP INDEX public.idx_product_tags;
       public            postgres    false    217            �           2606    16420 5   product_attributes product_attributes_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.product_attributes DROP CONSTRAINT product_attributes_product_id_fkey;
       public          postgres    false    214    3264    210            �           2606    16474 6   product_categories product_categories_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.product_categories DROP CONSTRAINT product_categories_category_id_fkey;
       public          postgres    false    219    3279    220            �           2606    16469 5   product_categories product_categories_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.product_categories DROP CONSTRAINT product_categories_product_id_fkey;
       public          postgres    false    220    3264    210            �           2606    16405 -   images_backups product_images_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.images_backups
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.images_backups DROP CONSTRAINT product_images_product_id_fkey;
       public          postgres    false    3264    212    210            �           2606    16439 )   product_tags product_tags_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.product_tags DROP CONSTRAINT product_tags_product_id_fkey;
       public          postgres    false    210    217    3264            �           2606    16444 %   product_tags product_tags_tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.product_tags DROP CONSTRAINT product_tags_tag_id_fkey;
       public          postgres    false    216    217    3272            �           2606    24660 "   products products_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.products DROP CONSTRAINT products_category_id_fkey;
       public          postgres    false    210    3279    219            u   �  x��S�N1]�_1@�k���o�!Ħ��t�JE�<���*�)��y��ıKZ�,�%����9�{t)�㣁�ֽ�Ǻ;�~���hӡ,љ��ˬJK*����?�!ox����ϱjx�G��j�s�M�C�;]8c��"�M$��*D�@��9/y�{�D�2G���SaZ i�@��8&"L������i�HS��H��N�?�^7֙RU���/ ������e�w���[�M����Hx�{�ܺ���� ߥ��q�:����?�$q�6���_�4
7w'���?�o�!3R���{�c³ �,���J[�@�y�s�i�ߠ���U�7q��c�o����&00K]J*�J�e*�ϯ�f�t�`��,	�V"|Ίm��+���7��W�gH]o��8�������I�{���Gx��Y���Z�ɮ�R>`��      x   z  x����n�@E����hWݪ~��?FB��`�b�~���m�@�*�7��փ�x���a��|=�]�~8uv<���f^�V��5XN�X7�hL��q�?�5f��!h�B�D�D���.T�k}�Չՙ�#6fG6�(\a�7=_��p�o����w��W� ��
�P�&�������O���mž���5E��}V�`�r�%��a�0Ü,������0�0��_b�i���v.mq���2`����n�h��n!u+�Le�j}��/��q�^}w�����J�M|b.�Ҕ�Z�)UsZL���x���e9���b}搡��|�B�"*�	� ��1+�*��V����:��sa���B�z��E��E��䇄E��3�
ۦi��      n      x������ � �      p      x������ � �      v      x������ � �      s      x������ � �      l   z   x�3�(�O)M.Q0TH�/RpN,IM�/�T0�tI-N.�,(���K!f�!�342�30�4202�54�50Q04�2��20�3�452�#c�e
�߈X����7��~3�����o�f�1%���qqq AfF      r   =   x�3�0�®�mv\��2�0�¾�.v_��e�ya>���b���/6\������ g��      z   l   x�3�LL����T1JR14Pqr	4���M)�)4v��0�pI�.M
��Mt1��31�	/	�M��q֏4��Lr�4202�54�5�T00�22�2��3��47����� ���     