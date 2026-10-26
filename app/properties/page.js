"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Bed, Bath, Maximize2, Filter, Heart, ArrowUpDown, Building } from "lucide-react";
import { CITIES, PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";
import FavoriteButton from "@/components/FavoriteButton";

export default function PropertiesPage({ searchParams }) {
  const unwrappedParams = searchParams ? use(searchParams) : {};

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [city, setCity] = useState(unwrappedParams.city || "");
  const [listingType, setListingType] = useState(unwrappedParams.listingType || "");
  const [propertyType, setPropertyType] = useState(unwrappedParams.propertyType || "");
  const [bedrooms, setBedrooms] = useState(unwrappedParams.bedrooms || "");
  const [search, setSearch] = useState(unwrappedParams.search || "");

  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (listingType) params.append("listingType", listingType);
      if (propertyType) params.append("propertyType", propertyType);
      if (bedrooms) params.append("bedrooms", bedrooms);
      if (search) params.append("search", search);

      const res = await fetch(`http://localhost:5000/api/properties?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setProperties(json.data?.properties || []);
        setTotalCount(json.data?.total || 0);
      } else {
        setProperties([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProperties();
  }, [city, listingType, propertyType, bedrooms]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProperties();
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by locality, landmark, or project name..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
          >
            Search Properties
          </button>
        </form>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>

          {/* Purpose Tab */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setListingType("")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                listingType === "" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setListingType("sale")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                listingType === "sale" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setListingType("rent")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                listingType === "rent" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Rent
            </button>
          </div>

          {/* City select */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Property Type select */}
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Property Types</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>{pt.label}</option>
            ))}
          </select>

          {/* Bedrooms select */}
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any BHK</option>
            {BHK_OPTIONS.map((bhk) => (
              <option key={bhk.value} value={bhk.value}>{bhk.label}</option>
            ))}
          </select>

          {(city || listingType || propertyType || bedrooms || search) && (
            <button
              onClick={() => {
                setCity("");
                setListingType("");
                setPropertyType("");
                setBedrooms("");
                setSearch("");
              }}
              className="ml-auto text-rose-600 hover:text-rose-700 font-semibold underline text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {city ? `Properties in ${city}` : "All Real Estate Properties"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Showing {properties.length} {properties.length === 1 ? "property" : "properties"} available
          </p>
        </div>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
              <div className="h-52 bg-slate-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No properties matched your search</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search filters or browse other popular cities.
          </p>
          <button
            onClick={() => {
              setCity("");
              setListingType("");
              setPropertyType("");
              setBedrooms("");
              setSearch("");
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => {
            const primaryImg = p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
            return (
              <div
                key={p.propertyId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={primaryImg}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
                      {p.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                    {p.featured && (
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider bg-amber-500 text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton propertyId={p.propertyId} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="text-2xl font-extrabold text-slate-900">
                        {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                      </div>
                      <span className="text-xs text-slate-500 font-medium capitalize">
                        {p.propertyType?.replace("_", " ")}
                      </span>
                    </div>

                    <Link href={`/properties/${p.propertyId}`}>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1 hover:text-indigo-600 transition">
                        {p.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {p.locality}, {p.city}
                    </p>

                    {/* Features row */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                      {p.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-indigo-600" />
                          {p.bedrooms} Beds
                        </span>
                      )}
                      {p.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-indigo-600" />
                          {p.bathrooms} Baths
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4 text-indigo-600" />
                        {Number(p.areaSqFt).toLocaleString()} sq.ft
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 capitalize">
                      Owner: <span className="text-slate-700 font-medium">{p.owner?.name || "Verified Seller"}</span>
                    </span>
                    <Link
                      href={`/properties/${p.propertyId}`}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
