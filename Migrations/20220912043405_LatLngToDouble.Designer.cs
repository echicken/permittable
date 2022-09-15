﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using permittable.PostgreSQL;

#nullable disable

namespace permittable.Migrations
{
    [DbContext(typeof(PermitContext))]
    [Migration("20220912043405_LatLngToDouble")]
    partial class LatLngToDouble
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("permittable.PostgreSQL.Address", b =>
                {
                    b.Property<string>("GeoID")
                        .HasColumnType("text");

                    b.Property<double?>("Latitude")
                        .HasColumnType("double precision");

                    b.Property<double?>("Longitude")
                        .HasColumnType("double precision");

                    b.Property<string>("Postal")
                        .HasColumnType("text");

                    b.Property<string>("Text")
                        .HasColumnType("text");

                    b.Property<string>("WardGrid")
                        .HasColumnType("text");

                    b.HasKey("GeoID");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("permittable.PostgreSQL.Permit", b =>
                {
                    b.Property<string>("Number")
                        .HasColumnType("text");

                    b.Property<int>("Revision")
                        .HasColumnType("integer");

                    b.Property<string>("AddressGeoID")
                        .HasColumnType("text");

                    b.Property<DateTime>("Applied")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("Completed")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CurrentUse")
                        .HasColumnType("text");

                    b.Property<int>("DwellingsCreated")
                        .HasColumnType("integer");

                    b.Property<int>("DwellingsLost")
                        .HasColumnType("integer");

                    b.Property<float>("EstimatedCost")
                        .HasColumnType("real");

                    b.Property<DateTime>("Issued")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LongDescription")
                        .HasColumnType("text");

                    b.Property<string>("PermitType")
                        .HasColumnType("text");

                    b.Property<string>("ProposedUse")
                        .HasColumnType("text");

                    b.Property<string>("ShortDescription")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .HasColumnType("text");

                    b.Property<string>("StructureType")
                        .HasColumnType("text");

                    b.HasKey("Number", "Revision");

                    b.HasIndex("AddressGeoID");

                    b.ToTable("Permits");
                });

            modelBuilder.Entity("permittable.PostgreSQL.Permit", b =>
                {
                    b.HasOne("permittable.PostgreSQL.Address", "Address")
                        .WithMany("Permits")
                        .HasForeignKey("AddressGeoID");

                    b.Navigation("Address");
                });

            modelBuilder.Entity("permittable.PostgreSQL.Address", b =>
                {
                    b.Navigation("Permits");
                });
#pragma warning restore 612, 618
        }
    }
}